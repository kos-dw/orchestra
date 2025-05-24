import type { MediaLibrary } from "app/domain/.server/entities/mediaLibrary.entities";
import { Xmark } from "app/presentation/components/svg";
import { HTTP_STATUS } from "app/shared/constants";
import { useEffect, useState } from "react";

type ResultType =
  | {
      Ok: {
        mediaLibraryList: MediaLibrary[];
      };
      Err: null;
    }
  | {
      Ok: null;
      Err: {
        message: string;
        status: HTTP_STATUS;
      };
    };

export function ImageModal({
  setIsOpen,
  setImgValue,
}: {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setImgValue: React.Dispatch<
    React.SetStateAction<{ url: string; alt: string } | null>
  >;
}) {
  const [images, setImages] = useState<MediaLibrary[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadImages = async () => {
    const res = await fetch("/api/mediaLibrary/v1/findall");
    if (!res.ok) throw new Error("Failed to fetch");
    const result: ResultType = await res.json();
    return result;
  };

  useEffect(() => {
    void (async () => {
      try {
        const result = await loadImages();

        if (result.Err) throw new Error(result.Err.message);
        setImages(result.Ok.mediaLibraryList);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        console.error(errorMessage, error, setError(errorMessage));
      }
    })();
  }, []);

  return (
    <div className="fixed inset-0 bg-gray-800/80 flex justify-center items-center z-10">
      <div className="bg-white p-4 rounded-lg w-10/12 max-w-[900px]">
        <div className="flex justify-between mb-8">
          <div className="">
            <h2 className="text-lg font-bold mb-2">画像を選択</h2>
          </div>
          <div className="">
            <button
              onClick={() => setIsOpen(false)}
              className=" cursor-pointer"
            >
              <Xmark className="w-6 h-6" />
            </button>
          </div>
        </div>

        {error ? (
          <p>{error}</p>
        ) : (
          <ul className="grid grid-cols-5 gap-8">
            {images ? (
              images.map((row) => (
                <li key={row.unique_key}>
                  <button
                    className="cursor-pointer aspect-square mb-2 border"
                    type="button"
                    onClick={() => {
                      setImgValue({
                        url: row.filepath,
                        alt: row.title || "",
                      });
                      setIsOpen(false);
                    }}
                  >
                    <img
                      className="w-full h-full object-cover"
                      src={row.filepath}
                      alt={row.title || ""}
                    />
                  </button>
                  <dl className="flex flex-col-reverse">
                    <dt>
                      <p className="truncate">{row.title}</p>
                    </dt>
                  </dl>
                </li>
              ))
            ) : (
              <p>ロード中...</p>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
