import {PureComponent} from 'react'
import {List} from 'antd-mobile'
import Header from '@/components/header/'
import {connect} from 'dva'
import router from 'umi/router'

@connect(({help}) => ({
    list:help.list
}))

export default class extends PureComponent {
    render() {
        const list = this.props.list
        return (
            <>
                <Header
                    title={'帮助中心'}
                />
            <List
                renderHeader={'常见问题'}
            >
                {list.map(item => (
                    <List.Item
                        key={item.id}
                        arrow={'horizontal'}
                        onClick={() => {router.push({pathname:'help/detail',query:{id:item.id}})}}
                    >
                        {item.title}
                    </List.Item>
                ))}
            </List>
            </>
        )
    }
}
