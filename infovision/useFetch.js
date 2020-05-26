import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

import config from 'components/config';

const useFetch = (url) => {
  const apiUrl = `${config.BASE_URL}${url}`;
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState(null);
  
  const doFetch = useCallback((options) => {
    setOptions(options);
    setIsLoading(true);
  }, []);
  
  useEffect(() => {
    let skipGetResponseAfterDestroy = false
    if (!isLoading) return;

    const requestOptions = {...options, ...{headers: {
      'Content-type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    }}};


    axios(apiUrl, requestOptions)
      .then(response => {
        if (!skipGetResponseAfterDestroy) {
          setIsLoading(false);
          setResponse(response.data);
        }
      })
      .catch(error => {
        if (!skipGetResponseAfterDestroy) {
          setIsLoading(false);
          setError(error.response);
        }
      });
      return () => {
        skipGetResponseAfterDestroy = true;
      }
  }, [isLoading, url, options]);


  return [{ response, error, isLoading }, doFetch];
};

export default useFetch;
