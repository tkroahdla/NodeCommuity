0420(금 저녁) 
===

## await async
콜백 함수와 프로미스의 단점을 보완하고 가독성을 높여준다.

>사용법
```js
async function a(){
    return 1;
}
```

```js
async function a(){
    return Promise.resolve(1);
}
```
위코드와 아래 코드는 같은 코드다.

function 앞에 async를 붙이면 해당 함수는 자동 Promise객체로 인식되고 return값은 resolve()값과 같다.

<br/>

return 값은
```js
Promise{<resolved>:1}
```
이다.

<br>

그리고 비동기로 처리되는 부분 앞에 await를 붙여준다.

await는 Promise가 처리될 때까지 기다린다.

```js
async function a1(){ 
    let result = await Promise.resolve(1); 
    return result;
}
a1(); /// 1
```
async/await를 사용하면 await가 대기를 처리해준다. .then이 거의 필요없다.