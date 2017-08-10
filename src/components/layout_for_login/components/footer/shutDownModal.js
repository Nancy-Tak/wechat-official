import React, {Component} from 'react';
import {withRouter} from 'react-router';
import {
	Toast,
	Modal,
	Icon
 } from 'antd-mobile';
const alert = Modal.alert;
import {axios, session} from 'UTILS';
import classNames from 'classnames';
import './shutDownModal.less';
import shutDownIcon from 'ASSETS/svg/shutdown.svg';
import refreshIcon from 'ASSETS/svg/refresh.svg';
import logoutIcon from 'ASSETS/svg/logout.svg';

class ShutDownModal extends Component {

	static defaultProps = {
    visible: false,
  };

	static propTypes = {
		visible: React.PropTypes.bool,
	};

	//要发送关机或者重启信息給寄主
	SendMessageToClient = (msg) => {
		axios
		.get(
			'/api/logout'
		)
		.then(res => {

			const message = new Object();
			message.type = msg;
			message.data = new Object();
			const json = JSON.stringify(message);

			switch (res.status) {
				case 1:
				{
					session.clearUserInfo();
					this.props.router.push('/');
					try {
						window.external.SendMessageToClient(json);
					} catch (e) {};
					break;
				}
				case 0:
				{
					Toast.fail(res.message,2);
					break;
				}
				default:
			}
		})
		.catch(error => {
			Toast.fail(res.message,2);
		})
	}

  logout = () => {
    axios.get('/api/logout').then(response => {
      session.clearUserInfo();
      this.props.router.push('/');
      Toast.info('您已经成功注销账号', 2);
    }).catch(error => {
      Toast.fail(res.message, 2);
    })
  }

	render() {

    const shutDownModalClass = classNames({
      shutDownModal: true,
      visible: this.props.visible,
    })

		const rebootConfirm = () => {
			const alertReboot = alert('您正在重启设备', '未提交的内容将会丢失，是否继续?', [
				{
					text: '取消',
				},
				{
					text: '确定重启',
					style: {fontWeight: 'bold'},
					onPress: () => {
						this.SendMessageToClient('reboot')
					},
				},
			]);
			// 	setTimeout(() => {
			//  		alertReboot.close();
			// 	}, 0);
		};

		const powerDownConfirm = () => {
			const alertPowerDown = alert('您正在关机', '未提交的内容将会丢失，是否继续?', [
				{
					text: '取消',
				},
				{
					text: '确定关机',
					style: {fontWeight: 'bold'},
					onPress: () => {
						this.SendMessageToClient('shutdown')
					},
				},
			]);
			// 	setTimeout(() => {
			//  		alertPowerDown.close();
			// 	}, 0);
		};

		const logoutConfirm = () => {
			const alertLougout = alert('您正在注销账户', '未提交的内容将会丢失，是否继续?', [
				{
					text: '取消',
				},
				{
					text: '确定注销',
					style: {fontWeight: 'bold'},
					onPress: () => {
						this.logout()
					},
				},
			]);
			// 	setTimeout(() => {
			//  		alertReboot.close();
			// 	}, 0);
		};

    const rebootBtn = (
      <div onClick={rebootConfirm}>
        <Icon
          type={refreshIcon}
          styleName="icon"
        />
        <h4>重启</h4>
      </div>
    )

    const powerDownBtn = (
      <div onClick={powerDownConfirm}>
        <Icon
          type={shutDownIcon}
          styleName="icon"
          style={{
            left:'47%',
            top:'47%'
          }}
        />
        <h4>关机</h4>
      </div>
    )

		return (
			<div styleName={shutDownModalClass} onClick={this.props.onClick}>
				{rebootBtn}
        {powerDownBtn}
				<div onClick={logoutConfirm}>
					<Icon
						type={logoutIcon}
						styleName="icon"
						style={{
							left:'45%',
						}}
					/>
					<h4>注销</h4>
				</div>
			</div>
		);
	}
}

export default withRouter(ShutDownModal);
