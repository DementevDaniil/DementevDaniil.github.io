export function CreateBlobFromImage(image: HTMLImageElement) {
    let parts = image.src.split(',');
    let imageMIME = parts[0].split(':')[1].split(';')[0];
    let binaryVal = '';
    if (parts[0].indexOf('base64') >= 0) binaryVal = atob(parts[1]);
    else binaryVal = decodeURIComponent(parts[1]);
    return new Blob([binaryVal], {
        type: imageMIME
    });
}
