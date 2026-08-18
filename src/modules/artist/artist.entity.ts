export interface ArtistProps {
  id: string,
  name: string,
  biography?: string,
  isVerified: boolean,
  avatarUrl?: string,
  createdAt: Date,
  updatedAt: Date,
}

export class Artist {
  private props: ArtistProps;

  constructor(props: ArtistProps) {
    this.props = props;
  }

  public get id(): string { return this.props.id; }
  public get name(): string { return this.props.name; }
  public get biography(): string { return this.props.biography; }
  public get isVerified(): boolean { return this.props.isVerified; }
  public get avatarUrl(): string { return this.props.avatarUrl; }
  public get createdAt(): Date { return this.props.createdAt }
  public get updatedAt(): Date { return this.props.updatedAt }


  public changeName(newName: string): void {
    this.props.name = newName;
  }
}

