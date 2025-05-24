import { useRef } from "react";
import { data } from "react-router";
// import { MediaLibraryService } from "~/.server/application/services/mediaLibrary.service";
import {
  logger,
  mediaLibraryService,
  sessionsService,
} from "app/di/.server/inversify.config";
// import type { MediaLibrary } from "~/.server/domain/entities/mediaLibrary.entities";
import Container from "app/presentation/components/container";
import { INFO } from "app/shared/constants";
import { catchException } from "app/shared/errors";
// import type { Result } from "~/types";
import type { Route } from ".react-router/types/app/presentation/routes/+types/mediaLibrary";
// import type { MediaLibraryService } from "app/application/.server/usecases/mediaLibrary";
import { Xmark } from "app/presentation/components/svg";
import { convertDateString } from "app/shared/utils/.common";
import { getCallerInfo } from "app/shared/utils/.server";
import Marquee from "../components/marquee";

export function meta({}: Route.MetaArgs) {
  return [
    { title: `メディアライブラリ | ${INFO.TITLE}` },
    {
      name: "description",
      content: `メディアライブラリ | ${INFO.DESCRIPTION}`,
    },
  ];
}

// type LoaderPayloadType = Result<
//   { mediaLibraryList: MediaLibrary[] },
//   {
//     message: string;
//     status: HTTP_STATUS;
//   }
// >;

export async function loader({ request }: Route.LoaderArgs) {
  try {
    const mediaLibraryList = await mediaLibraryService.getListAll();

    return {
      Ok: { mediaLibraryList },
      Err: null,
    };
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

// type ActionPayloadType = Result<
//   { list: string[] },
//   {
//     message: string;
//     status: HTTP_STATUS;
//   }
// >;

export async function action({ request }: Route.ActionArgs) {
  const { commitSession, getSession } =
    sessionsService.getSessionStorage();

  try {
    const formData = await request.formData();
    const session = await getSession(request.headers.get("Cookie"));
    const { auth } = session.data;
    if (!auth) {
      throw new Error("Unauthorized");
    }

    // 各情報を取得
    const user_id = auth.id;
    const file = formData.get("image") as File;
    const checksum = formData.get("checksum") as string;

    if (!file) {
      throw new Error("File not found");
    }
    if (!checksum) {
      throw new Error("Checksum not found");
    }

    await mediaLibraryService.saveFile({
      file,
      checksum,
      user_id,
    });
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

export default function MediaLibrary({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const loaderPayload = loaderData;

  const dialogRef = useRef<HTMLDialogElement>(null);
  if (loaderData?.Err) return <p>{loaderData.Err.message}</p>;

  const { mediaLibraryList } = loaderData.Ok;

  return (
    <>
      <Marquee>
        <div className="flex justify-between items-center">
          <div className="w-9/12">
            <h1 className="heading-primary">メディアライブラリ</h1>
          </div>
          <div className="w-auto">
            <button
              type="submit"
              className="bg-primary hover:bg-slate-500 text-white p-4 rounded-md cursor-pointer disabled:opacity-30"
              onClick={() => dialogRef.current?.showModal()}
            >
              新規追加
            </button>
            <Dialog dialogRef={dialogRef} />
          </div>
        </div>
      </Marquee>
      <Container className="pt-8">
        <ul className="grid grid-cols-4 gap-4">
          {mediaLibraryList.map((media) => (
            <li key={media.id} className="">
              <div className="aspect-square mb-2 bg-gray-400 border">
                <img
                  title={media.title || ""}
                  src={media.filepath}
                  alt={media.title || ""}
                  className="w-full h-full object-contain"
                />
              </div>
              <dl className="grid grid-cols-1">
                <dt>
                  <p className="truncate">{media.title}</p>
                </dt>
                <dd className="text-sm text-gray-500">
                  [Pixel] {media.width}x{media.height}
                </dd>
                <dd className="text-sm text-gray-500">
                  [Size] {((media.data_size ?? 0) / 1024).toFixed(2)} KB
                </dd>
                <dd className="text-sm text-gray-500">
                  [Create]{" "}
                  {media.created_at
                    ? convertDateString(media.created_at)
                    : ""}
                </dd>
              </dl>
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}

function Dialog({
  dialogRef,
}: {
  dialogRef: React.RefObject<HTMLDialogElement | null>;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const inputImageRef = useRef<HTMLInputElement>(null);
  const inputChecksumRef = useRef<HTMLInputElement>(null);

  const handleOnChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;
      if (!inputChecksumRef.current) return;

      // ハッシュ値を生成
      const arrayBuffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest(
        "SHA-256",
        arrayBuffer,
      );
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      inputChecksumRef.current.value = hashHex;
    } catch (error) {
      console.error(error);
    }
  };

  const handleFileUpload = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    try {
      if (!formRef.current) return;
      if (!inputImageRef.current) return;
      const image = inputImageRef.current.files?.[0];
      if (!image) return;

      if (
        confirm("アップロードしてもよろしいですか？\n" + image.name)
      ) {
        formRef.current.submit();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="top-1/2 left-1/2 -translate-1/2 w-10/12 max-w-[900px] p-8 backdrop:bg-primary/80"
    >
      <div className="flex justify-between">
        <div className="">
          <h2 className="text-lg truncate">アセットのアップロード</h2>
        </div>
        <div className="">
          <button
            onClick={() => dialogRef.current?.close()}
            className=" cursor-pointer"
          >
            <Xmark className="w-6 h-6" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2">
        <div className="col-span-1">
          <form
            encType="multipart/form-data"
            method="POST"
            ref={formRef}
          >
            <input
              type="hidden"
              name="checksum"
              ref={inputChecksumRef}
            />
            <input
              type="file"
              name="image"
              className="file:mr-4 file:border-0 file:bg-gray-400 file:p-4 file:text-sm file:font-semibold file:text-white hover:file:bg-slate-600 file:cursor-pointer"
              ref={inputImageRef}
              onChange={handleOnChange}
            />
          </form>
        </div>
        <div className="col-span-1"></div>
      </div>
      <div className="flex justify-end">
        <div className="mr-4">
          <button
            type="button"
            className="bg-gray-400 hover:bg-slate-500 text-white p-4 cursor-pointer disabled:opacity-30"
            onClick={() => dialogRef.current?.close()}
          >
            キャンセル
          </button>
        </div>
        <div className="">
          <button
            type="button"
            className="bg-primary hover:bg-slate-500 text-white p-4 cursor-pointer disabled:opacity-30"
            onClick={handleFileUpload}
          >
            アップロード
          </button>
        </div>
      </div>
    </dialog>
  );
}
