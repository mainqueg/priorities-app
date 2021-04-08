import { toast } from 'react-toastify'
import { useRef } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import FeatureList from '../components/feature-list'
import FeatureForm from '../components/feature-form'
import Header from '../components/header'
import useSWR from 'swr'
import fetcher from '../lib/fetcher'
import { FEATURE_TYPE } from '../lib/const'
// import FormNotification from '../components/form-notification'

function Home() {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0()
  const inputNewFeature = useRef()
  // const inputEmail = useRef()

  const { data, isValidating, mutate } = useSWR('api/list', fetcher, {
    initialData: { [FEATURE_TYPE.NEW]: [], [FEATURE_TYPE.RELEASED]: [] },
    revalidateOnMount: true,
    revalidateOnFocus: false
  })

  const getToken = (func) => {
    return async (props) => {
      if (!isAuthenticated) {
        toast.error('Login olman gerekli')
        return false
      }

      const token = await getAccessTokenSilently()

      if (!token) {
        toast.error('User not found')
        return false
      }

      return func(token, props)
    }
  }

  const onPublish = getToken(async (token, item) => {
    const requestOptions = {
      method: 'POST',
      headers: {
        authorization: token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(item)
    }
    fetch('api/publish', requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          toast.error(data.error)
        } else {
          mutate()
        }
      })
  })

  const onVote = getToken(async (token, item) => {
    const requestOptions = {
      method: 'POST',
      headers: {
        authorization: token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(item)
    }
    fetch('api/vote', requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          toast.error(data.error)
        } else {
          mutate()
        }
      })
  })

  const onSubmitNewFeature = getToken(async (token) => {
    const requestOptions = {
      method: 'POST',
      headers: {
        authorization: token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title: inputNewFeature.current.value })
    }

    fetch('api/create', requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          toast.error(data.error)
        } else {
          toast.info('Your feature has been added to the list.')
          inputNewFeature.current.value = ''
          mutate()
        }
      })
  })

  // const handleNewEmail = (event) => {
  //   const requestOptions = {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ email: inputEmail.current.value })
  //   }
  //   fetch('api/addemail', requestOptions)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       if (data.error) {
  //         toast.error(data.error)
  //       } else {
  //         toast.info('Your email has been added to the list.')
  //         inputEmail.current.value = ''
  //         refreshData()
  //       }
  //     })
  //   event.preventDefault()
  // }

  return (
    <>
      <Header />

      <main>
        <FeatureForm
          onSubmitNewFeature={onSubmitNewFeature}
          inputNewFeature={inputNewFeature}
        />
        <div className="mt-10">
          <FeatureList
            data={data}
            dataLoading={isValidating}
            onVote={onVote}
            onPublish={onPublish}
          />
        </div>
      </main>

      {/*<FormNotification*/}
      {/*  handleNewEmail={handleNewEmail}*/}
      {/*  inputEmail={inputEmail}*/}
      {/*/>*/}
    </>
  )
}

export default Home