import { PrismaClient } from "@prisma-app/client";
import { AuthService } from "app/application/.server/usecases/auth.service";
import {
  logger as loggerOrigin,
  LoggingService,
} from "app/application/.server/usecases/logging.service";
import { MediaLibraryService } from "app/application/.server/usecases/mediaLibrary.service";
import { SessionsService } from "app/application/.server/usecases/sessions.service";
import { UsersService } from "app/application/.server/usecases/users.service";
import { WeblogService } from "app/application/.server/usecases/weblog.service";
import { MediaLibraryRepository } from "app/infrastructure/.server/repositories/mediaLibrary.repository";
import { UsersRepository } from "app/infrastructure/.server/repositories/users.repository";
import { WeblogRepository } from "app/infrastructure/.server/repositories/weblog.repository";
import { enigma } from "app/shared/utils/.server";
import { Container } from "inversify";
import "reflect-metadata";
import { type Logger } from "winston";

const di = new Container();

// シングルトンスコープでバインド
// ------------------------------------------------------------------------
// LoggingServiceコンテナ
di.bind("LoggingService")
  .toDynamicValue(() => new LoggingService(loggerOrigin))
  .inSingletonScope();
const logger = di.get<Logger>("LoggingService");

// PrismaClientコンテナ
di.bind("DbClient")
  .toDynamicValue(() => new PrismaClient())
  .inSingletonScope();
const db = di.get<PrismaClient>("DbClient");

// 通常のバインド
// ------------------------------------------------------------------------
// SessionsServiceコンテナ
di.bind("SessionsService").toDynamicValue(
  () => new SessionsService(db),
);
const sessionsService = di.get<SessionsService>("SessionsService");

// UsersServiceコンテナ
di.bind("UsersService").toDynamicValue(
  () => new UsersService(new UsersRepository(db)),
);
const usersService = di.get<UsersService>("UsersService");

// AuthServiceコンテナ
di.bind("AuthService").toDynamicValue(
  () => new AuthService(db, enigma),
);
const authService = di.get<AuthService>("AuthService");

// MediaLibraryServiceコンテナ
di.bind("MediaLibraryService").toDynamicValue(
  () => new MediaLibraryService(new MediaLibraryRepository(db)),
);
const mediaLibraryService = di.get<MediaLibraryService>(
  "MediaLibraryService",
);

// WeblogServiceコンテナ
di.bind("WeblogService").toDynamicValue(
  () => new WeblogService(new WeblogRepository(db), usersService),
);
const weblogService = di.get<WeblogService>("WeblogService");

export {
  authService,
  db,
  logger,
  mediaLibraryService,
  sessionsService,
  usersService,
  weblogService,
  type PrismaClient as DbClient,
};
