export enum WidgetErrorCode {
  WIDGET_NOT_FOUND = 'WIDGET_NOT_FOUND',
  INVALID_WIDGET_ID = 'INVALID_WIDGET_ID',
  INVALID_CONTENT = 'INVALID_CONTENT',
  INVALID_WIDGET_TYPE = 'INVALID_WIDGET_TYPE'
}

export class WidgetError extends Error {
  constructor(
    public readonly code: WidgetErrorCode,
    public readonly message: string
  ) {
    super(message);
    this.name = 'WidgetError';
  }
}

export class WidgetNotFoundError extends WidgetError {
  constructor(id: string) {
    super(WidgetErrorCode.WIDGET_NOT_FOUND, `Widget with id ${id} not found`);
  }
}

export class InvalidWidgetIdError extends WidgetError {
  constructor(id: string) {
    super(WidgetErrorCode.INVALID_WIDGET_ID, `Invalid widget ID: ${id}`);
  }
}

export class InvalidContentError extends WidgetError {
  constructor(content: string) {
    super(WidgetErrorCode.INVALID_CONTENT, `Invalid widget content: ${content}`);
  }
}

export class InvalidWidgetTypeError extends WidgetError {
  constructor(type: string) {
    super(WidgetErrorCode.INVALID_WIDGET_TYPE, `Invalid widget type: ${type}`);
  }
}
