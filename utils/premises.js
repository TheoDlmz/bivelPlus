export const success = (value) => {
    return new Promise((resolve) =>  resolve(value));
  };
  
export const failure = (value) => {
    return new Promise((resolve, reject) =>  reject(value));
  };

