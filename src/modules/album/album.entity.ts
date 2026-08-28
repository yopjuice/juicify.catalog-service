export interface AlbumProps {
  id: string;
  title: string;
  releaseDate?: Date;
  coverUrl?: string;
  type: AlbumType;
  genreId: string;
  artistId: string;
  createdAt: Date;
  updatedAt: Date;
}

export const AlbumType = {
  LP: 'LP',
  EP: 'EP',
  Single: 'Single',
} as const;

export type AlbumType = typeof AlbumType[keyof typeof AlbumType];

export class Album {
  // Real data is secured
  private props: AlbumProps;

  constructor(props: AlbumProps) {
    this.props = props;
  }
  // Getters and setters for props

  public get id(): string {
    return this.props.id;
  }
  public get title(): string {
    return this.props.title;
  }
  public get releaseDate(): Date | undefined {
    return this.props.releaseDate;
  }
  public get coverUrl(): string | undefined {
    return this.props.coverUrl;
  }
  public get type(): AlbumType {
    return this.props.type;
  }
  public get genreId(): string {
    return this.props.genreId;
  }
  public get artistId(): string {
    return this.props.artistId;
  }
  public get createdAt(): Date {
    return this.props.createdAt;
  }
  public get updatedAt(): Date {
    return this.props.updatedAt;
  }

  public changeTitle(newtitle: string): void {
    if (newtitle.length < 3)
      throw new Error('title must be at least 3 characters long');
    this.props.title = newtitle;
  }

}
