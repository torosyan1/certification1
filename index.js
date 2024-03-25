const express = require('express');
const Jimp = require('jimp');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

// Parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/jpg', async (req, res) => {
  try {

    const { type, name } = req.body;
    let path = null;

    if (type === 'standart') {
      path = './IMG_6346.PNG';
    } else if (type === 'premium') {
      path = './IMG_2352.PNG';
    } else {
      path = './IMG_6347.PNG'
    }

    // Load the image
    await Jimp.read(path, async (err, image) => {
      if (err) throw err;

      // Load the font
      await Jimp.loadFont(Jimp.FONT_SANS_128_BLACK).then(async (font) => {
        // Add text to the image
        image.print(font, 900, 1510, name);

        // Save the modified image
        await image.write('output.jpg', (err) => {
          if (err) throw err;
          console.log('Image with text saved.');
          const filePath = './output.jpg'
          const fileStream = fs.createReadStream(filePath);
      
          fileStream.pipe(res);
        });
      }).catch(err => {
        console.error(err);
      });
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});