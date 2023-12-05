import store from "@/store";
import { User } from "@/libs/graphql/types/users";
import { cloneDeep } from "lodash";
import { UI_VERSION, UI_VERSION_MAJOR, UI_VERSION_MINOR } from "@/main";
import { SailCMS } from "@/libs/graphql";

export type ExtensionConfigs = {
    theme: string;
    locale: string;
    user: User;
};

export class Extensions
{
    private static handshakeSignature = '';
    private static isConnected = false;
    private static target: HTMLIFrameElement;
    private callback: Function;

    constructor(callback: Function, configs: ExtensionConfigs)
    {
        this.callback = callback;

        window.onmessage = (e) =>
        {
            const message = e.data.message;
            const data = e.data.data;

            switch (message)
            {
                case 'hello':
                    if (data.handshakeKey === Extensions.handshakeSignature) {
                        Extensions.isConnected = true;

                        if (import.meta.env.MODE === 'development') {
                            console.log("HELLO: extension connected");
                        }

                        // Send initial data
                        this.respond('OK', {
                            theme: configs.theme,
                            locale: configs.locale,
                            locales: SailCMS.getLocales(),
                            currentUser: cloneDeep(configs.user),
                            version: UI_VERSION,
                            majorVersion: UI_VERSION_MAJOR,
                            minorVersion: UI_VERSION_MINOR,
                            baseURL: SailCMS.getURL().replace('/graphql', '')
                        })
                    }
                    break;

                default:
                    callback(message, data);
                    break;
            }
        }
    }

    /**
     *
     * Run the handshake protocol to make a safe connection
     *
     * @param frame
     * @param handshakeKey
     *
     */
    public handshake(frame: HTMLIFrameElement, handshakeKey: string = '')
    {
        if (handshakeKey === '') {
            console.error('SailCMS: Cannot load extension ui because the handshake key is not set or unavailable.');
            return;
        }

        Extensions.handshakeSignature = handshakeKey;
        Extensions.target = frame;

        this.sendMessage(frame, 'handshake', {});
    }

    /**
     *
     * Respond to a request from the iframe
     *
     * @param message
     * @param data
     *
     */
    public respond(message: string, data: any)
    {
        this.sendMessage(Extensions.target, message, {result: data});
    }

    public static established(): boolean
    {
        return Extensions.isConnected;
    }

    private sendMessage(frame: HTMLIFrameElement, message: string, data: object)
    {
        // @ts-ignore
        frame.contentWindow.postMessage({message: message, data: data}, '*')
    }
}
