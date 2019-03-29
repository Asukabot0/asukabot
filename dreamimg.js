var fs = require('fs');
var Jimp = require('jimp');

const MaskSizex = 582;
const MaskSizey = 387;
const OffsetX = 0;
const OffsetY = 0;

// Read background image
var backgroundImage = null;
Jimp.read('drm_background.png').then(image => {
    backgroundImage = image;
});
Jimp.read('drm_cloudMask.png').then(image => {
    cloudMask = image;
});

var dreamImage = function(inputImage, agent = null) {
    return new Promise(resolve => {
        Jimp.read({
            url: inputImage,
            agent: agent
        }).then(foreground => {
            var composed = backgroundImage.clone();
            foreground.scaleToFit(MaskSizex, MaskSizey);
            foreground.contain(MaskSizex, MaskSizey);
            var cloud = foreground.clone();
            cloud.mask(cloudMask);
            cloud.composite(composed, OffsetX, OffsetY);
            cloud.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
                if (err) {
                    throw err;
                }
                resolve(buffer);
            });
        }).catch(err => {
            console.error(err);
            resolve(null);
        })
    });
}

if (require.main === module) {
    setTimeout(() => {
        dreamImage('google.png').then(buffer => {
            fs.writeFileSync('test.png', buffer);
        })
    }, 100);
}

exports.dreamImage = dreamImage;
