import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useRef, useEffect, useCallback, useMemo } from 'react'


async function submit(key) {
  try {
    // const url = `https://openai.1rmb.tk/dashboard/billing/credit_grants`
    // const response = await fetch('https://openai.1rmb.tk/dashboard/billing/credit_grants', {
    const response = await fetch('/api/dashboard/billing/credit_grants', {
      method: 'get',
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${key}`
      }
    })
    if (!response.ok) {
      const data = await response.json()
      // console.log(data);
      return data
      // throw new Error('API request failed')
    }
    const data = await response.json()
    // console.log(data);
    return data
  } catch (error) {
    console.error(error)
  }
}

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [balance, setBalance] = useState(null)
  const [alert, setAlert] = useState(null)
  const keyRef = useRef(null)
  const [ipinfo, setIpinfo] = useState('正在获取 IP 信息...')
  const [ipinfov, setIpinfov] = useState('正在获取 IP 信息...')


  useEffect(() => {
    fetch('https://forge.speedtest.cn/api/location/info')
      .then(res1 => res1.json())
      .then((res1) => {
        const info1 = `国内的IP: ${res1.ip} (${res1.province} ${res1.city} ${res1.distinct} ${res1.isp})`
        setIpinfo(info1)
      })
      .catch(err => {
        console.log(err);
        setIpinfo('获取国内的IP信息失败')
      })
    fetch('https://ip.1rmb.tk/ip')
      .then(res2 => res2.json())
      .then((res2) => {
        const info2 = `访问本站的IP: ${res2.ip} (${res2.addr} ${res2.info})`
        setIpinfov(info2)
      }).catch(err => {
        console.log(err);
        setIpinfov('获取访问本站的IP信息失败')
      })

  }, [])



  const handleClick = async () => {
    setAlert(null)
    setLoading(true)
    const key = keyRef.current.value
    if (/^sk-.{21,}$/.test(key)) {
      await submit(key)
        .then((data) => {
          if (data.hasOwnProperty('total_granted')) {
            setBalance(data)
            setLoading(false)
            setAlert({ type: 'success', message: '查询成功' })
          } else if (data.hasOwnProperty('error')) {
            // console.log(data);
            setLoading(false)
            setAlert({ type: 'error', message: data.error.message })
          }
        })
        .catch(e => {
          // console.log(e);
          setAlert({ type: 'error', message: '查询失败，请检查 API Key 是否正确' })
          setLoading(false)
        })
    } else {
      setAlert({ type: 'error', message: 'API Key 格式不正确' })
      setLoading(false)
    }
  }



  return (
    <>
      <Head>
        <title>OPENAI API PROXY</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.h1}>查询 ChatGPTAPI 余额</h1>
        </header>
        <main className={styles.main}>

          {alert && (
            <p className={`${styles.alert} ${styles[alert?.type]}`}>{alert?.message}</p>

          )}
          <input className={styles.input} placeholder="请输入以sk-开头的key..." ref={keyRef} /><br />
          <button className={`${styles.button} ${loading ? styles.loading : ''}`} disabled={loading} onClick={handleClick}>
            {loading ? 'Loading...' : '查询'}
          </button>

          {balance && (
            <div className={styles.balance}>
              <p>额度总量：{balance.total_granted}</p>
              <p>已用额度：{balance.total_used}</p>
              <p>剩余额度：{balance.total_available}</p>
            </div>
          )}

        </main>

        <footer className={styles.footer}>
          <i><a className={styles.a} href="https://github.com/x-dr/chatgptProxyAPI">By @x-dr</a></i>
          <p >{ipinfo}</p>
          <p >{ipinfov}</p>

        </footer>

      </div>
      <style global jsx>{`
            :root {
              --color-primary: #5c7cfa;
              --color-primary-dark: #4263eb;
              --color-primary-alpha: #5c7cfa50;
            
              --body-color: #495057;
              --body-bg: #f8f9fa;
            
              --border-color: #dee2e6;
            }

            body {
              margin: 0;
              padding: 0;

              max-width: 30rem;
              margin-left: auto;
              margin-right: auto;
              padding-left: 2rem;
              padding-right: 2rem;
              color: var(--body-color);
              background: var(--body-bg);
              font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              line-height: 1.5;
              -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
              text-rendering: optimizelegibility;
              -webkit-font-smoothing: antialiased;
            }
            @keyframes rotate {
              100% {
                  transform: rotate(360deg);
              }
            }

       `}</style>
    </>
  )
}


