let percent = 0;

const timer = setInterval(() => {
    process.stdout.write(`\rUploading... ${percent}%`);
    process.stdout.write(`\rUploading... ${percent + 5}%`);

    percent += 10;

    if (percent > 100) {
        clearInterval(timer);
        process.stdout.write("\nDone\n");
    }
}, 500);