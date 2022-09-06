import React, { useEffect, useState } from 'react';
import Routes from './Routes';
import UpperBar from './common/jsx-elements/upperBar';
import { getHomeService as HomeService } from './Home/Service';
import { getLinks as links } from './common/util/links';

//available icons https://www.w3schools.com/icons/fontawesome_icons_webapp.asp

export default function App() {

  const [homeInfo, setHomeInfo] = useState()

  useEffect(() => {

    const getHomeInfo = async () => {
      const url = new URL(links().HOME_PATH, links().API_BASE_URL)
      const hs = HomeService(url)
      const hi = await hs.getHomeInfo()
      setHomeInfo(hi)
    }

    getHomeInfo()

  }, [])

  return (

    <React.Fragment>
      <UpperBar />
      {homeInfo && <Routes homeInfo={homeInfo} />}
    </React.Fragment>
  );
}
