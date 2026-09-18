import Script from 'next/script'

const BING_UET_ID = process.env.NEXT_PUBLIC_BING_UET_ID || '97269863'

export function BingAds() {
  if (!BING_UET_ID || process.env.NODE_ENV !== 'production') {
    return null
  }

  return (
    <>
      <Script id="bing-uet" strategy="afterInteractive">
        {`
          (function(w,d,t,r,u){var f,n,i;w[u]=w[u]||[],f=function(){var o={ti:"${BING_UET_ID}"};o.q=w[u],w[u]=new UET(o),w[u].push("pageLoad")},n=d.createElement(t),n.src=r,n.async=1,n.onload=n.onreadystatechange=function(){var s=this.readyState;s&&s!=="loaded"&&s!=="complete"||(f(),n.onload=n.onreadystatechange=null)},i=d.getElementsByTagName(t)[0],i.parentNode.insertBefore(n,i)})(window,document,"script","//bat.bing.com/bat.js","uetq");
        `}
      </Script>
      <noscript>
        <img
          src={`//bat.bing.com/action/0?ti=${BING_UET_ID}&Ver=2`}
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
          alt=""
        />
      </noscript>
    </>
  )
}
