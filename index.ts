import { adapter } from "adapters.ts";
import { AsyncQueue } from "adapters.ts/extensions/async-queue";

const isStringArray = (data: unknown) : data is string[] => true
const isBool = (data: unknown) : data is boolean => true
const isFStat = (data: unknown) : data is {
    read: boolean;
    path: string;
    write: boolean;
    name: string;
    basedir: string;
    size: number;
    hidden: boolean;
    directory: boolean;
    ctime: number;
    mtime: number;
    atime: number;
    mimetype: string;
} => true
const isFStatArray = (data: unknown) : data is {
    read: boolean;
    path: string;
    write: boolean;
    name: string;
    basedir: string;
    size: number;
    hidden: boolean;
    directory: boolean;
    ctime: number;
    mtime: number;
    atime: number;
    mimetype: string;
    }[] => true
const isFileForm =  (data: unknown) : data is {
   file: {
       readonly size: number;
       readonly type: string;
       arrayBuffer: () => Promise<ArrayBuffer>;
       bytes: () => Promise<Uint8Array>;
       slice: (start?: number, end?: number, contentType?: string) => Blob;
       stream: () => ReadableStream<Uint8Array>;
       text: () => Promise<string>;
   };
} => true

const isValidateWritePayload =  (data: unknown) : data is {
   algorithm: string;
   checksum: string;
} => true

const FsAdapter = adapter.extend({
  defaultAutoRetry: 0,
  defaultTimeout: 4000,
  basePath: "files",
});

const FsIOAdapter = adapter.extend({
  defaultAutoRetry: 0,
  defaultTimeout: 0,
  basePath: "files",
});

new AsyncQueue(4).register(FsIOAdapter);

export const FilesEndpoints = {
  read: FsIOAdapter.endpoint({
    url: "read",
    searchParams: ["path"],
  }),
  write: FsIOAdapter.endpoint({
    url: "write",
    searchParams: ["path"],
    validateRequest: { post: isFileForm },
    options: {
      defaultHeaders: {
        "Content-Type": "multipart/form-data",
      },
    },
  }),
  copy: FsAdapter.endpoint({
    url: "copy",
    searchParams: ["from", "into"],
  }),
  move: FsAdapter.endpoint({
    url: "move",
    searchParams: ["from", "into"],
  }),
  delete: FsAdapter.endpoint({
    url: "delete",
    searchParams: ["path"],
  }),
  mkdir: FsAdapter.endpoint({
    url: "mkdir",
    searchParams: ["path"],
  }),
  touch: FsAdapter.endpoint({
    url: "touch",
    searchParams: ["path"],
  }),
  validateWrite: FsAdapter.endpoint({
    url: "validatewrite",
    searchParams: ["path"],
    validateRequest: {
      post: isValidateWritePayload,
    },
  }),
  readdir: FsAdapter.endpoint({
    url: "readdir",
    searchParams: ["path"],
    validate: { get: isStringArray },
  }),
  readdirStat: FsAdapter.endpoint({
    url: "readdirstat",
    searchParams: ["path"],
    validate: { get: isFStatArray },
  }),
  stat: FsAdapter.endpoint({
    url: "stat",
    searchParams: ["path"],
    validate: { get: isFStat },
  }),
  exists: FsAdapter.endpoint({
    url: "exists",
    searchParams: ["path"],
    validate: { get: isBool },
  }),
  dirExists: FsAdapter.endpoint({
    url: "direxists",
    searchParams: ["path"],
    validate: { get: isBool },
  }),
};


FilesEndpoints.
