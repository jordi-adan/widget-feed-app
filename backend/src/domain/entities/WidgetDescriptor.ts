import { WidgetId } from './value-objects/WidgetId';
import { WidgetType } from './value-objects/WidgetType';
import { ContentType } from './value-objects/ContentType';
import { LoadingState } from './value-objects/LoadingState';
import { ErrorState } from './value-objects/ErrorState';

interface StaticWidgetDescriptorProps {
  id: WidgetId;
  widgetType: WidgetType;
  contentType: ContentType;
  staticContent: Record<string, any>;
}

interface DynamicWidgetDescriptorProps {
  id: WidgetId;
  widgetType: WidgetType;
  contentType: ContentType;
  dataUrl: string;
  loadingState: LoadingState;
  errorState: ErrorState;
}

export class WidgetDescriptor {
  private constructor(
    private readonly id: WidgetId,
    private readonly widgetType: WidgetType,
    private readonly contentType: ContentType,
    private readonly staticContent?: Record<string, any>,
    private readonly dataUrl?: string,
    private readonly loadingState?: LoadingState,
    private readonly errorState?: ErrorState
  ) {}

  public static createStatic(props: StaticWidgetDescriptorProps): WidgetDescriptor {
    if (!props.contentType.isStatic()) {
      throw new Error('Cannot create static widget descriptor with dynamic content type');
    }

    return new WidgetDescriptor(
      props.id,
      props.widgetType,
      props.contentType,
      props.staticContent
    );
  }

  public static createDynamic(props: DynamicWidgetDescriptorProps): WidgetDescriptor {
    if (!props.contentType.isDynamic()) {
      throw new Error('Cannot create dynamic widget descriptor with static content type');
    }

    if (!props.dataUrl || props.dataUrl.trim() === '') {
      throw new Error('Data URL cannot be empty for dynamic widgets');
    }

    return new WidgetDescriptor(
      props.id,
      props.widgetType,
      props.contentType,
      undefined,
      props.dataUrl,
      props.loadingState,
      props.errorState
    );
  }

  public getId(): WidgetId {
    return this.id;
  }

  public getWidgetType(): WidgetType {
    return this.widgetType;
  }

  public getContentType(): ContentType {
    return this.contentType;
  }

  public getStaticContent(): Record<string, any> | undefined {
    return this.staticContent;
  }

  public getDataUrl(): string | undefined {
    return this.dataUrl;
  }

  public getLoadingState(): LoadingState | undefined {
    return this.loadingState;
  }

  public getErrorState(): ErrorState | undefined {
    return this.errorState;
  }

  public isStatic(): boolean {
    return this.contentType.isStatic();
  }

  public isDynamic(): boolean {
    return this.contentType.isDynamic();
  }

  public isExpandable(): boolean {
    return this.widgetType.isExpandableList();
  }

  public isInteractive(): boolean {
    return this.widgetType.isQuickActions();
  }

  public updateStaticContent(newContent: Record<string, any>): WidgetDescriptor {
    if (this.isDynamic()) {
      throw new Error('Cannot update static content on dynamic widget');
    }

    return new WidgetDescriptor(
      this.id,
      this.widgetType,
      this.contentType,
      newContent
    );
  }

  public equals(other: WidgetDescriptor): boolean {
    if (!this.id.equals(other.id)) {
      return false;
    }

    if (!this.widgetType.equals(other.widgetType)) {
      return false;
    }

    if (!this.contentType.equals(other.contentType)) {
      return false;
    }

    if (this.isStatic()) {
      return JSON.stringify(this.staticContent) === JSON.stringify(other.staticContent);
    }

    return this.dataUrl === other.dataUrl &&
           this.loadingState?.equals(other.loadingState!) === true &&
           this.errorState?.equals(other.errorState!) === true;
  }
}
