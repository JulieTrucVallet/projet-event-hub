export interface UserProps {
  id: string;
  firstname: string;
  lastname: string;
  email: string;

  passwordHash: string;

  otpEnabled: boolean;
  otpSecret?: string;

  createdAt: Date;
  updatedAt: Date;
}

export class User {
  public readonly props: UserProps;

  private constructor(props: UserProps) {
    this.validate(props);
    this.props = props;
  }

  static create(props: UserProps): User {
    return new User(props);
  }

  private validate(props: UserProps): void {
    if (!props.firstname || props.firstname.trim().length === 0) {
      throw new Error("User firstname cannot be empty");
    }

    if (!props.lastname || props.lastname.trim().length === 0) {
      throw new Error("User lastname cannot be empty");
    }

    const email = props.email.trim().toLowerCase();

    if (!email) {
        throw new Error("User email cannot be empty");
    }

    if (!email.includes("@")) {
        throw new Error("User email is invalid");
    }

    if (!props.passwordHash || props.passwordHash.trim().length === 0) {
      throw new Error("User password hash cannot be empty");
    }

    if (props.otpEnabled && (!props.otpSecret || props.otpSecret.trim().length === 0)) {
      throw new Error("OTP secret is required when 2FA is enabled");
    }
  }

  get id() {
    return this.props.id;
  }

  get firstname() {
    return this.props.firstname;
  }

  get lastname() {
    return this.props.lastname;
  }

  get email() {
    return this.props.email;
  }

  get passwordHash() {
    return this.props.passwordHash;
  }

  get otpEnabled() {
    return this.props.otpEnabled;
  }

  get otpSecret() {
    return this.props.otpSecret;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }
}