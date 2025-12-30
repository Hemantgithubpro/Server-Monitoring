function getRandomValue(array){ // Returns a random value from the provided array
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}

function doSomeHeavyTask(){
    const ms=getRandomValue([210,320,480,500,120,150,200,300,400]);

    const shouldFail=Math.random()<0.5; // 50% chance to fail
    if(shouldFail){
        const randomerror=getRandomValue([
            "DB Payment Failure",
            "DB Server Down",
            "Access Denied",
            "Not Found",
        ]);
        throw new Error(randomerror);
    }
    return new Promise((resolve,reject) => setTimeout(() => resolve(ms),ms));
}
module.exports = { doSomeHeavyTask };