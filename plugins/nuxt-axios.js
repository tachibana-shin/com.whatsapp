export default function({ $axios, redirect }) {
  //   $axios.onRequest(config => {
  //     console.log("Making request to " + config.url);
  //   });

  $axios.interceptors.response.use(
    function(response) {
      // Do something with response data
      return response;
    },
    function(error) {
      return Promise.reject(error);
    }
  );
}
