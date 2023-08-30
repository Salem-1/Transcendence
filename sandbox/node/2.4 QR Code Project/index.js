import inquirer from 'inquirer';
import qr from 'qr-image';
import fs from 'fs';

const questions = [
  {
    type: 'input',
    name: 'url',
    message: "Please enter the URL you would like to turn into a QR code: ",
  }
];

inquirer
  .prompt(questions)
  .then((answers) => {
    var answer = answers.url;
    console.log('User provided answers:\n');
    console.log(answer);

    const qr_svg = qr.image(answer);
    qr_svg.pipe (fs.createWriteStream(`${answer}_qr.png`));
    fs.writeFileSync(`${answer}_qr.txt`, answer, function(err) {
        if(err) {
            console.log(err);
        }
    });  
    console.log('QR code image saved.');
  })
  .catch((error) => {
    console.error('Error occurred:', error);
  });
