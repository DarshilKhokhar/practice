import { NextFunction, Request } from "express";
import { GenericObject, IErrorFormatter, IExtendedResponse, IOkFormatter, IResponseData, IResponseFormatter } from "../common/common-types";
import { messages } from "../common/messages";

export const responseFormatter = () => (
  req: Request,
  res: IExtendedResponse,
  next: NextFunction
): void => {
  res.formatter = generateFormatters();
  next();
};

export const generateFormatters = (): IResponseFormatter => {
  const formatter = {} as IResponseFormatter;
  let responseBody = {};
  formatter.ok = (data: GenericObject, status: boolean, code: string) => {
    responseBody = generateSuccessResponse({ data, status, code });
    return responseBody as IOkFormatter;
  };

  formatter.error = (
    data: GenericObject | null,
    status: boolean,
    code: string,
    err?: Error
  ) => {
    responseBody = generateErrorResponse({ data, status, code, err });
    return responseBody as IErrorFormatter;
  };
  return formatter;
}

const generateSuccessResponse = async (
  result: IResponseData
): Promise<IOkFormatter> => {
  const { data, status, code } = result;
  const message = getMessage(code, 'success');
  return {
    status,
    success: {
      code,
      message,
      data: JSON.parse(JSON.stringify(data))
    },
    error: null
  };
};

const generateErrorResponse = async (
  result: IResponseData
): Promise<IErrorFormatter> => {
  const { data, status, code, err: errorStack } = result;
  const message = getMessage(code, 'error');
  return {
    status,
    error: {
      code,
      message,
      data,
      errorStack
    },
    success: null
  };
};

export const getMessage = (code: string, type: string) => {
  return messages[type][code];
}