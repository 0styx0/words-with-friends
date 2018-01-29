interface Window {
    // tslint:disable-next-line:no-any
    Notification?: any;
}

declare const window: Window;

function notify(options: {icon?: string, body: string}) {

    (window.Notification).requestPermission().then(() => {

        return new window.Notification('Words With Friends', options);
    });
}

export default notify;