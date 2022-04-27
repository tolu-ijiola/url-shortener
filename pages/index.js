import Head from 'next/head'
import styles from '../styles/Home.module.scss'
import { Button, Card, InputBase, LinearProgress, Snackbar } from '@mui/material';
import Copy from '@mui/icons-material/ContentCopy'
import Open from '@mui/icons-material/OpenInNewRounded'
import { useState } from 'react';
import { Box } from '@mui/system';

const axios = require('axios').default;

export default function Home() {

  const [text, settext] = useState("");
  const [result, setresult] = useState("")
  const [error, seterror] = useState("")
  const [copied, setcopied] = useState(false)
  const [loading, setloading] = useState(false)

  const shortenlink = () => {
    seterror("")
    if (text.length > 0) {
      setloading(true)
      axios.post(`https://api.shrtco.de/v2/shorten?url=${text}`).then(res => {
        setresult(res.data.result.full_short_link)
        setloading(false)
      }).catch(err => {
        seterror(err.message)
      })
    }else{
      seterror("Text cannot be empty")
    }
  }

  const copy = () => {
    navigator.clipboard.writeText(result)
    setcopied(true)
    setTimeout(() => {
      setcopied(false)
    }, 3000);
  }

  const open = () => {
    window.open(result, "_blank")
  }

  return (
    <div>
      <Head>
        <title>URL Shortener</title>
      </Head>
      <div className={styles.body}>
        <Card className={styles.card} variant="elevation">
          {
            loading && <Box sx={{ width: '100%' }}>
            <LinearProgress />
          </Box>
          }
          <h1>Create short links!</h1>
          <p>Create short urls by entering your link below</p>
          <Card className={styles.textinput} variant="elevation">
          <InputBase onChange={e => settext(e.target.value)} placeholder="Enter url address" fullWidth/>
          <Button onClick={() => shortenlink()} className={styles.searchbutton} variant="contained" size="large">Shorten</Button>
          </Card>
          <p className={styles.error}>{error}</p>
          <div className={styles.result}>
            <h3>Your url is : </h3>
            <p>{result === "" ? "shortened url would appear here" : result}</p>
            {
              result !== "" && <Button onClick={() => copy()}><Copy className={styles.icon}/></Button>
            }
            {
              result !== "" &&  <Button onClick={() => open()}><Open className={styles.icon}/></Button>
            }
          </div>
        </Card>
        <Snackbar
          open={copied}
          autoHideDuration={3000}
          message="Copied text to clipboard"
        />
      </div>
    </div>
  )
}
