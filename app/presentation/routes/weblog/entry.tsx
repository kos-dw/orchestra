import { logger, weblogService } from "app/di/.server/inversify.config";
import Container from "app/presentation/components/container";
import Marquee from "app/presentation/components/marquee";
import { userDataStore } from "app/presentation/stores";
import { HTTP_STATUS, INFO } from "app/shared/constants";
import { catchException, Exception } from "app/shared/errors";
import type { Quill } from "app/shared/utils/.client";
import { ImageModal, QuillEditor } from "app/shared/utils/.client";
import { convertDateString } from "app/shared/utils/.common";
import { getCallerInfo } from "app/shared/utils/.server";
import {
  type WeblogFormType,
  WeblogFormSchema,
} from "app/shared/validator";
import { useAtomValue } from "jotai";
import { useEffect, useRef, useState } from "react";
import { data, redirect } from "react-router";
import { toast } from "sonner";
import type { typeToFlattenedError } from "zod";
import { z } from "zod";
import type { Route } from "./+types/entry";

export function meta({ data }: Route.MetaArgs) {
  let title;

  if (data.Ok && data.Ok.crud === "update") {
    title = `ウェブログ更新 - ${data.Ok.record?.title ?? "no title"}`;
  } else {
    title = `ウェブログ新規作成`;
  }

  return [
    { title: `${title} | ${INFO.TITLE}` },
    {
      name: "description",
      content: `${title} | ${INFO.DESCRIPTION}`,
    },
  ];
}

// **********************************************************************
// loader
// **********************************************************************
export async function loader({ request, params }: Route.LoaderArgs) {
  try {
    const slug = params.slug;

    // 記事の新規作成
    // --------------------------------------------------

    if (slug === "newentry") {
      return {
        Ok: {
          crud: "create",
          record: null,
        },
        Err: null,
      };
    }

    // 記事の更新 - slugがUUID形式でない場合は、400を返す
    // --------------------------------------------------

    const parsedSlug = z.string().uuid().safeParse(slug);

    if (!parsedSlug.success) {
      throw new Exception(
        HTTP_STATUS[HTTP_STATUS.BAD_REQUEST],
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    const record = await weblogService.getDataByUniqueKey(
      parsedSlug.data,
    );
    if (record) {
      return {
        Ok: {
          crud: "update",
          record,
        },
        Err: null,
      };
    }

    // newentryでもなく、記事も見つからない場合
    // --------------------------------------------------

    throw new Exception(
      HTTP_STATUS[HTTP_STATUS.NOT_FOUND],
      HTTP_STATUS.NOT_FOUND,
    );
  } catch (error) {
    logger.error(
      error instanceof Error ? error.message : "Unknown error.",
      getCallerInfo(),
    );
    const payload = catchException(error);
    // 異常系のレスポンス
    return data(payload, { status: payload.Err.status });
  }
}

// **********************************************************************
// action
// **********************************************************************
export async function action({ request }: Route.ActionArgs) {
  try {
    const formData = await request.formData();
    const id = formData.get("id") as string | null;
    const crud = formData.get("crud") as string | null;

    if (!formData) {
      throw new Exception(
        HTTP_STATUS[HTTP_STATUS.BAD_REQUEST],
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    switch (crud) {
      case "create": {
        // 新規作成
        const record = await weblogService.create(formData);
        break;
      }
      case "update": {
        // 更新
        const record = await weblogService.update(formData);
        break;
      }
      case "delete": {
        // 削除
        const record = await weblogService.delete(id);
        break;
      }

      default:
        throw new Exception(
          HTTP_STATUS[HTTP_STATUS.BAD_REQUEST],
          HTTP_STATUS.BAD_REQUEST,
        );
    }

    return redirect("/weblog");
  } catch (error) {
    logger.error(
      error instanceof Error ? error.message : "Unknown error.",
      getCallerInfo(),
    );
    const payload = catchException(error);
    // 異常系のレスポンス
    return data(payload, { status: payload.Err.status });
  }
}

// **********************************************************************
// client
// **********************************************************************
export default function Entry({ loaderData }: Route.ComponentProps) {
  // ペイロード
  // --------------------------------------------------

  if (loaderData.Err) {
    return <p>{loaderData.Err.message}</p>;
  }
  const { crud, record } = loaderData.Ok;

  // 初期設定
  // --------------------------------------------------

  const isUpdateEntry = crud === "update";
  const userData = useAtomValue(userDataStore);

  const createFormRef = useRef<HTMLFormElement>(null);
  const eyecatchRef = useRef<HTMLInputElement>(null);
  const deleteFormRef = useRef<HTMLFormElement>(null);

  const [imgValue, setImgValue] = useState<{
    url: string;
    alt: string;
  } | null>(null);
  const [isClient, setIsClient] = useState<boolean>(false);
  const [isPublished, setIsPublished] = useState(true);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [validationError, setValidationError] =
    useState<typeToFlattenedError<WeblogFormType> | null>(null);
  const [quill, setQuill] = useState<Quill | null>(null);
  const [weblogContents, setWeblogContents] = useState<string | null>(
    null,
  );

  // イベントハンドラ
  // --------------------------------------------------

  // 記事の更新ボタンを押したときの処理
  const handleSubmit = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    const buttonEl = event.target as HTMLButtonElement;
    buttonEl.disabled = true;
    setValidationError(null);

    const formEl = createFormRef.current;
    try {
      if (!formEl) {
        throw new Error("Form not found");
      }

      const formData = new FormData(formEl);
      const parsedData = WeblogFormSchema.safeParse(
        Object.fromEntries(formData.entries()),
      );

      if (!parsedData.success) {
        setValidationError(parsedData.error.flatten());
        buttonEl.disabled = false;
        toast.error("バリデーションエラー");
        console.error(parsedData.error.flatten());
        return;
      }

      toast.info(
        isUpdateEntry ? "記事を更新しますか" : "記事を作成しますか",
        {
          description: parsedData.data.title,
          classNames: {
            description: "text-xs!",
            actionButton: "bg-primary! text-white! ml-0!",
            cancelButton: "bg-slate-400! text-white!",
          },
          closeButton: false,
          duration: 10000,
          action: {
            label: "Yes",
            onClick: () => {
              formEl.submit();
              toast.dismiss();
              buttonEl.disabled = false;
            },
          },
          cancel: {
            label: "Cancel",
            onClick: () => {
              buttonEl.disabled = false;
              toast.dismiss();
            },
          },
          onDismiss: (t) => (buttonEl.disabled = false),
          onAutoClose: (t) => (buttonEl.disabled = false),
        },
      );
    } catch (error) {
      console.error(error);
      buttonEl.disabled = false;
    }
  };

  // 記事の削除ボタンを押したときの処理
  const handleDelete = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    try {
      const buttonEl = event.target as HTMLButtonElement;
      buttonEl.disabled = true;
      toast.error("記事を削除してもいいですか", {
        description: record?.title || "",
        classNames: {
          description: "text-xs!",
          actionButton: "bg-primary! text-white! ml-0!",
          cancelButton: "bg-slate-400! text-white!",
        },
        closeButton: false,
        duration: 10000,
        action: {
          label: "Yes",
          onClick: () => {
            toast.dismiss();
            deleteFormRef.current?.submit();
          },
        },
        cancel: {
          label: "Cancel",
          onClick: () => {
            buttonEl.disabled = false;
            toast.dismiss();
          },
        },
        onDismiss: (t) => (buttonEl.disabled = false),
        onAutoClose: (t) => (buttonEl.disabled = false),
      });
    } catch (error) {
      console.error(error);
    }
  };

  // useEffect
  // --------------------------------------------------

  // クライアントの初期化判定
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 画像のURLをeyecatchにセット
  useEffect(() => {
    if (imgValue && eyecatchRef.current) {
      eyecatchRef.current.value = imgValue.url;
    }
  }, [imgValue]);

  // update時にアイキャッチ画像の初期値をセット
  useEffect(() => {
    if (isUpdateEntry && record?.eyecatch) {
      setImgValue({
        url: record.eyecatch,
        alt: record.title || "アイキャッチ画像",
      });
    }
  }, []);

  // quillの各種処理
  useEffect(() => {
    if (quill) {
      const handler = () =>
        setWeblogContents(JSON.stringify(quill.getContents()));

      // エディタの変更を監視して、更新ごとにinput[name=content]要素にセットする
      quill.on("text-change", handler);

      // crud === updateの時、記事本文をセットする
      if (record?.contents) {
        quill.setContents(JSON.parse(record.contents));
      }
    }
  }, [quill]);

  // レンダリング
  // --------------------------------------------------

  return (
    <>
      <Marquee>
        <div className="flex justify-between items-center">
          <div className="w-9/12">
            <h1 className="heading-primary">
              {isUpdateEntry ? "記事更新" : "新規記事作成"}
            </h1>
          </div>
          <div className="w-auto">
            <button
              type="submit"
              className="bg-primary hover:bg-slate-500 text-white p-4 rounded-md cursor-pointer disabled:opacity-30"
              onClick={handleSubmit}
            >
              記事の保存
            </button>
          </div>
        </div>
      </Marquee>
      <Container>
        <div className="bg-white p-4">
          <div className="text-sm text-gray-500">
            <dl className="flex">
              <dt>Unique key:&nbsp;</dt>
              <dd>{record?.unique_key ?? "-"}</dd>
            </dl>
          </div>
          <form method="POST" ref={createFormRef}>
            <input
              type="hidden"
              name="id"
              defaultValue={record?.id ? record.id.toString() : ""}
            />
            <input type="hidden" name="crud" defaultValue={crud} />
            <ul className="grid grid-cols-12 gap-4">
              <li className="col-span-4">
                <dl className="mb-4">
                  <dt>アイキャッチ画像</dt>
                  <dd>
                    <div className="aspect-video mb-2">
                      {imgValue ? (
                        <img
                          src={imgValue.url}
                          alt={imgValue.alt}
                          className="w-full h-full object-cover object-center"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-300 grid place-items-center">
                          <p className="text-white">NO IMAGE</p>
                        </div>
                      )}
                    </div>
                    <div className="">
                      <input
                        type="hidden"
                        name="eyecatch"
                        ref={eyecatchRef}
                        readOnly
                      />
                    </div>
                    <ul className="flex gap-2">
                      <li>
                        <button
                          type="button"
                          className="bg-slate-800 hover:bg-slate-500 text-white px-4 py-1 rounded-full cursor-pointer"
                          onClick={() => setIsOpen(true)}
                        >
                          {imgValue ? "画像を変更" : "画像を選択"}
                        </button>
                      </li>
                      {imgValue && (
                        <li>
                          <button
                            type="button"
                            className="bg-orange-800 hover:bg-orange-500 text-white px-4 py-1 rounded-full cursor-pointer"
                            onClick={() => setImgValue(null)}
                          >
                            画像を解除
                          </button>
                        </li>
                      )}
                    </ul>

                    {isOpen && (
                      <ImageModal
                        setIsOpen={setIsOpen}
                        setImgValue={setImgValue}
                      />
                    )}
                  </dd>
                </dl>
              </li>
              <li className="col-span-8 flex flex-row-reverse">
                <div className="pt-4">
                  <div className="mb-1">
                    <dl className="flex items-center gap-2">
                      <dt className="">最終更新者</dt>
                      <dd className="">
                        {record?.updated_by_display_name ?? "-"}
                      </dd>
                    </dl>
                  </div>
                  <div className="mb-1">
                    <dl className="flex items-center gap-2">
                      <dt className="">作成日</dt>
                      <dd className="">
                        {convertDateString(record?.created_at) ??
                          convertDateString(new Date())}
                      </dd>
                    </dl>
                  </div>
                  <div className="mb-1">
                    <dl className="flex items-center gap-2">
                      <dt className="">更新日</dt>
                      <dd className="">
                        {convertDateString(record?.updated_at) ?? "-"}
                      </dd>
                    </dl>
                  </div>
                  <div className="">
                    <label className="">
                      <dl className="flex items-center gap-2">
                        <dt className="order-2">
                          {isPublished ? (
                            <span className="inline-block w-24">
                              状態:公開
                            </span>
                          ) : (
                            <span className="inline-block w-24 text-gray-400">
                              状態:非公開
                            </span>
                          )}
                        </dt>
                        <dd className="order-1">
                          <input
                            type="hidden"
                            name="is_published"
                            defaultValue={isPublished ? "1" : "0"}
                          />
                          <input
                            type="checkbox"
                            className="peer sr-only"
                            defaultChecked={
                              record?.is_published ?? true
                            }
                            onChange={(e) =>
                              setIsPublished(e.target.checked)
                            }
                          />
                          <span className="text-xl block w-[2em] cursor-pointer bg-gray-300 rounded-full p-[0.1em] after:block after:h-[1em] after:w-[1em] after:rounded-full after:bg-white after:transition peer-checked:bg-primary peer-checked:after:translate-x-[calc(100%-0.2em)]"></span>
                        </dd>
                      </dl>
                    </label>
                  </div>
                </div>
              </li>
              <li className="col-span-12">
                <dl>
                  <dt>タイトル</dt>
                  <dd>
                    <input
                      name="title"
                      className="border border-slate-300 px-4 w-full h-12"
                      type="text"
                      defaultValue={record?.title ?? ""}
                    />
                    {validationError?.fieldErrors.title && (
                      <p className="text-red-500 text-sm">
                        {validationError.fieldErrors.title[0]}
                      </p>
                    )}
                  </dd>
                </dl>
              </li>
              <li className="col-span-6">
                <dl>
                  <dt>公開日</dt>
                  <dd>
                    <input
                      name="published_at"
                      className="border border-slate-300 px-4 w-full h-12"
                      type="date"
                      defaultValue={
                        convertDateString(record?.published_at, true) ??
                        ""
                      }
                    />
                    {validationError?.fieldErrors.published_at && (
                      <p className="text-red-500 text-sm">
                        {validationError.fieldErrors.published_at[0]}
                      </p>
                    )}
                  </dd>
                </dl>
              </li>
              <li className="col-span-6">
                <dl>
                  <dt>
                    {isUpdateEntry ? "記事更新者" : "記事投稿者"}
                    (変更不可)
                  </dt>
                  <dd>
                    <input
                      name="author_unique_key"
                      type="hidden"
                      defaultValue={userData?.user_unique_key || ""}
                      readOnly
                    />
                    <input
                      className="border border-slate-300 px-4 w-full h-12"
                      type="text"
                      defaultValue={userData?.display_name || ""}
                      readOnly
                    />
                  </dd>
                </dl>
              </li>
              <li className="col-span-12">
                <dl>
                  <dt>記事本文</dt>
                  <dd>
                    <input
                      type="hidden"
                      name="contents"
                      defaultValue={weblogContents || ""}
                    />
                    {isClient ? (
                      <QuillEditor setQuill={setQuill} />
                    ) : null}
                    {validationError?.fieldErrors.contents && (
                      <p className="text-red-500 text-sm">
                        {validationError.fieldErrors.contents[0]}
                      </p>
                    )}
                  </dd>
                </dl>
              </li>
            </ul>
          </form>

          {isUpdateEntry && (
            <div className="bg-gray-100 p-4 flex">
              <form ref={deleteFormRef} method="POST">
                <input
                  type="hidden"
                  name="id"
                  defaultValue={record?.id ?? ""}
                />
                <input
                  type="hidden"
                  name="crud"
                  defaultValue="delete"
                />
              </form>
              <button
                type="submit"
                className="bg-danger hover:bg-slate-500 text-white p-4 rounded-md cursor-pointer disabled:opacity-30"
                onClick={(event) => handleDelete(event)}
              >
                この記事の削除
              </button>
            </div>
          )}
        </div>
      </Container>
    </>
  );
}
