        const local = window.location;
        const urlSend = `${local.origin}/api/a`;
        const urlReceive = `${local.origin}/api/a`;

        fetch(urlReceive,{
            method:"POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message:"こんにちは"
            })
        })

        fetch(urlSend)
            .then(response => response.json())
            .then(data => {
                console.log(data.data.message);
            })
            .catch(error => {
                console.error("エラー:", error);
            });