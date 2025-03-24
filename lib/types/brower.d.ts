export { };

declare global
{
    interface Window extends Record<string, any> { }

    const Urls: any;
    const socket: WebSocket;
}

