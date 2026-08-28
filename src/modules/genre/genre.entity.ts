export interface GenreProps {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Genre {
  // Real data is secured
  private props: GenreProps;

  constructor(props: GenreProps) {
    this.props = props;
  }
  // Getters and setters for props

  public get id(): string {
    return this.props.id;
  }
  public get name(): string {
    return this.props.name;
  }
  public get createdAt(): Date {
    return this.props.createdAt;
  }
  public get updatedAt(): Date {
    return this.props.updatedAt;
  }

  public changeName(newName: string): void {
    if (newName.length < 3)
      throw new Error('Name must be at least 3 characters long');
    this.props.name = newName;
  }
}
