export type EventStatus = "scheduled" | "cancelled";

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
  status: EventStatus;
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

    if (!props.status) {
      throw new Error("Event status is required");
    }
  }

  cancel(organizerId: string): void {
    if (this.props.organizerId !== organizerId) {
      throw new Error("Only the organizer can cancel this event");
    }

    if (this.props.status === "cancelled") {
      throw new Error("Event is already cancelled");
    }

    if (this.props.startDate < new Date()) {
      throw new Error("Cannot cancel a past event");
    }

    this.props.status = "cancelled";
    this.props.updatedAt = new Date();
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

  get status() {
    return this.props.status;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }
}