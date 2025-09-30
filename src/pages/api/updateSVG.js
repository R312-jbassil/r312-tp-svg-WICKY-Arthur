async function update(updatedData) {
    const response = await fetch("/api/updateSVG", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
    });
    return response;
};