export interface FileSystemPort {
  exists(path: string): Promise<boolean>;
  readText(path: string): Promise<string>;
  findUp(startDirectory: string, fileName: string): Promise<string | null>;
}
