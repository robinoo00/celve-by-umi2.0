import {PureComponent} from 'react'
import styles from '../styles/dynamic-list.less'
import {Flex,Button} from 'antd-mobile'
import person from '@/assets/person.png'
import {mdate,reBuildCode} from '@/utils/common'

const Comp = ({list,link}) => (
    <div className={styles["container"]}>
        {list.map((item,index) => (
            <Flex className={styles["item"]} key={item.Code + index}>
                <Flex.Item>
                    <Flex>
                        <div className={styles["headimg"]}>
                            <img src={person} alt=""/>
                        </div>
                        <div className={styles["nickname"]}>
                            {item.Symbol}
                        </div>
                    </Flex>
                    <Flex className={styles["detail"]}>
                        <div>{mdate(item.Time)}</div>
                        <div>{reBuildCode(item.Code)}</div>
                    </Flex>
                </Flex.Item>
                <Flex.Item className={styles["submit"]}>
                    {/*<span data-color="down" style={{fontSize:'.55rem'}}>-{item.TotalFunds}</span>*/}
                    <Button type={'primary'} size={'small'} onClick={link(item.Code)}>点买</Button>
                </Flex.Item>
            </Flex>
        ))}
    </div>
)

export default Comp
