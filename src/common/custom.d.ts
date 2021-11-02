declare namespace Express {
  export interface Request {
    context?: IRequestContext;
  }
  export interface Response {
    formatter: IResponseFormatter;
  }
}