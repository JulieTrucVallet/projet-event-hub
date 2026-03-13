export interface EventProps {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  venueId: string;
  capacity: number;
  price?: number;
  organizerId: string;
  categoryId: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Event {
  public readonly props: EventProps;

  private constructor(props: EventProps) {
    this.validate(props);
    this.props = props;
  }

  static create(props: EventProps): Event {
    return new Event(props);
  }

  private validate(props: EventProps): void {
    if (!props.title || props.title.trim().length === 0) {
      throw new Error("Event title cannot be empty");
    }

    if (props.startDate <= new Date()) {
      throw new Error("Event start date must be in the future");
    }

    if (!props.venueId) {
      throw new Error("Event venue is required");
    }

    if (props.capacity < 1) {
      throw new Error("Event capacity must be at least 1");
    }

    if (!props.organizerId) {
      throw new Error("Event organizer is required");
    }

    if (!props.categoryId) {
      throw new Error("Event category is required");
    }

    if (props.price !== undefined && props.price < 0) {
      throw new Error("Event price must be a positive number");
    }
  }

  get id() {
    return this.props.id;
  }

  get title() {
    return this.props.title;
  }

  get description() {
    return this.props.description;
  }

  get startDate() {
    return this.props.startDate;
  }

  get venueId() {
    return this.props.venueId;
  }

  get capacity() {
    return this.props.capacity;
  }

  get price() {
    return this.props.price;
  }

  get organizerId() {
    return this.props.organizerId;
  }

  get categoryId() {
    return this.props.categoryId;
  }

  get imageUrl() {
    return this.props.imageUrl;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }
}