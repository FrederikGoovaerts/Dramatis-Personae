declare namespace process {
    const env: Record<string, string | undefined>;
}

declare module 'url' {
    const format: (obj: { host: string; pathname: string; protocol: string; search: string }) => string;
}
