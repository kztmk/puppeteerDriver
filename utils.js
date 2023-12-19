const sleep = (milliseconds) => {
  const random = Math.random() * 1000;
  return new Promise((resolve) => setTimeout(resolve, milliseconds + random));
};

export { sleep };
