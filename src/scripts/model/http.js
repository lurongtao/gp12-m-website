class Http {
  get() {
    return fetch('/api/listmore.json?pageNo=2&pageSize=15')
      .then(response => response.json())
      .then(result => {
        return result
      })
  }
}

// function test() {
//   return new Promise((resolve, reject) => {
//     $.ajax({
//       url: 'aa',
//       success(result) {
//         resolve(result)
//       }
//     })
//   }) 
// }

// function test() {
//   return $.ajax({
//     url: 'aa',
//     success(result) {
//       return result
//     }
//   })
// }

// async function getData() {
//   let result = await test()

// }
export default new Http()