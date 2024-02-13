import { HttpException, HttpStatus } from "@nestjs/common";

export class ErrorManager extends Error {
  constructor({ type, msg }: { type: keyof typeof HttpStatus, msg: string }) {
    super(`${type} :: ${msg}`);
  }

  public static createSignatureError(msg: string) {
    const code = msg.split("::")[0].trim();
    const httpCode = HttpStatus[code] || HttpStatus.INTERNAL_SERVER_ERROR;

    throw new HttpException(msg, httpCode);
  }
}