import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { TPairName } from '@/types/global'
import { useRedux } from '@/hooks/useRedux'
import { ButtonSelect } from '@/components/buttons/ButtonSelect'
import { ContextMenu } from '@/components/menu/ContextMenu'
import { useInit } from '@/features/trade/hooks/switch-pairs/use-init'
import { splitPair } from '@/utils/split-pair'
import { joinPair } from '@/utils/join-pair'
import { usePairName } from '@/features/trade/hooks/switch-pairs/use-pair-name'
import { useGlobalFetching } from '@/features/trade/hooks/switch-pairs/use-global-fetching'
import { SwitchPairs as Pairs } from '@/features/trade/containers/SwitchPairs'
import { getPairs } from '@/features/trade/store/switch-pairs'
import { useAuth } from '@/hooks/useAuth'

type TSwitchPairs = {
  driver: (pairName: TPairName) => JSX.Element
  route: string
}

export const SwitchPairs: React.FC<TSwitchPairs> = ({ driver, route }) => {
  const [, dispatch] = useRedux()
  const { userFetching } = useAuth()
  const { init } = useInit()
  const { pairName, setPairName } = usePairName()
  const { globalFetching } = useGlobalFetching()

  const router = useRouter()

  // get pairs list
  useEffect(() => {
    if (userFetching) return
    dispatch(getPairs())
  }, [userFetching])

  // set pair
  useEffect(() => {
    if (!pairName.main) return
    router.push(`${route}/${joinPair({ pairName, separator: 'url' })}`, undefined, {
      shallow: true
    })
  }, [pairName])

  // set initial pair
  useEffect(() => {
    if (userFetching) return
    const urlPair = router.query.pair && router.query.pair[0]
    if (urlPair) {
      setPairName(splitPair({ pair: urlPair, separator: 'url' }))
    }
  }, [userFetching])

  if (!init) return null

  return (
    <>
      <ContextMenu
        trigger={(open) => (
          <ButtonSelect
            id="selectpair"
            theme="secondary-small"
            label={joinPair({ pairName, separator: 'layout' }).toUpperCase()}
            additionalState={open}
            disabled={globalFetching}
          />
        )}
        renderMenu={({ onClose }) => <Pairs onChangePair={() => onClose()} />}
        position="bottom left"
        arrow={false}
        on={['click']}
        offsetY={15}
      />
      {driver(pairName)}
    </>
  )
}
