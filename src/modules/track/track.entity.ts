export interface TrackProps {
  id: string;
  title: string;
  duration: number;
  orderNumber?: number;
  albumId?: string;
  artistId: string;
  pathKey?: string;
  coverUrl?: string;
  status: TrackStatus;
  createdAt: Date;
  updatedAt: Date;
}

export const TrackStatus = {
  Ready: 'READY',
  Pending: 'PENDING',
  Error: 'ERROR',
} as const;

export type TrackStatus = typeof TrackStatus[keyof typeof TrackStatus];


export class Track {
  // Real data is secured
  private props: TrackProps;

  constructor(props: TrackProps) {
    this.props = props;
  }
  // Getters and setters for props

  public get id(): string {
    return this.props.id;
  }
  public get title(): string {
    return this.props.title;
  }
  public get duration(): number {
    return this.props.duration;
  }
  public get orderNumber(): number | undefined {
    return this.props.orderNumber;
  }
  public get albumId(): string | undefined {
    return this.props.albumId;
  }
  public get artistId(): string {
    return this.props.artistId;
  }
  public get pathKey(): string | undefined {
    return this.props.pathKey;
  }
  public get coverUrl(): string | undefined {
    return this.props.coverUrl;
  }
  public get status(): TrackStatus {
    return this.props.status;
  }
 
  public get createdAt(): Date {
    return this.props.createdAt;
  }
  public get updatedAt(): Date {
    return this.props.updatedAt;
  }

  public changeTitle(newName: string): void {
    if (newName.length < 3)
      throw new Error('Title must be at least 3 characters long');
    this.props.title = newName;
  }

}
