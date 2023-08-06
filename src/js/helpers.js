export const getJSON = async function (url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Unable to get data 😭");
    const data = await res.json();
    return data;
  } catch (err) {
    throw err;
  }
};
