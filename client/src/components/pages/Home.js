import React, { Component } from 'react';
import TimeAgo from 'react-timeago';


import {Query, Mutation} from 'react-apollo';
import {GET_SNAPS, ADD_SNAP} from '../../queries';


class Home extends Component {
    
    state = {
        text:"",
        user_id:""
    };

    onChange = e => {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        });
    };

    formValidate = () => {
        const { text } = this.state;
        return !text;
    };

    componentDidMount(){
        const {session} = this.props;
        if(session&&session.activeUser){
            this.setState({
                user_id:this.props.session.activeUser.id
            })
        }
    }

    onSubmit = (e, addSnap) => {
        e.preventDefault();
        if(!this.formValidate()){
            this.setState({
                text:''
            });
            addSnap()
                .then(({data}) => {   
                });
        }
    };

    updateCache = (cache, {data: {createSnap}}) =>{
        //console.log(cache);
        const { snaps } = cache.readQuery({
            query: GET_SNAPS
        });
        //console.log(snaps);
        cache.writeQuery({
            query: GET_SNAPS,
            data:{
                snaps: [createSnap, ...snaps]
            }
        });
    }

    render() {
        const {session} = this.props;

        const optimisticResponse = {
            __typename:"Mutation",
            createSnap: {
                __typename:"Snap",
                id: Math.round(Math.random()* -200000),
                text: this.state.text,
                createdAt: new Date(),
                user:{
                    __typename:"User",
                    ...session.activeUser
                }
            }
        }
        return (
            <div>
                <div className="description">
                    <p className="sub_header__desc">simple snap app with <span>react</span>.</p>
                </div>

                <div>
                    <Mutation 
                    mutation={ADD_SNAP} 
                    variables={{...this.state}}
                    //refetchQueries = {[{query:GET_SNAPS}]}
                    update = {this.updateCache}
                    optimisticResponse = {optimisticResponse}
                    >
                        {
                            (addSnap, {loading, error}) => (
                                <form
                                    onSubmit = {e => {
                                        this.onSubmit(e, addSnap);
                                    }}
                                >
                                    <input 
                                    className="add-snap__input" 
                                    type="text" 
                                    name="text"
                                    onChange={this.onChange}
                                    value={this.state.text}
                                    disabled={!(session&&session.activeUser)}
                                    placeholder={session && session.activeUser ? 'add snap' : 'please login for add a new snap'}/>
                                </form>
                            )
                        }
                    </Mutation>
                </div>
                <div>
                    <Query query={GET_SNAPS}>
                        {
                            ({data, loading, error}) => {
                                if(loading) return <div className="loading">Loading Snaps...</div>;
                                if(error) return <div>{error}</div>;

                                return (
                                    <div>
                                        <ul className="snaps">
                                            {
                                                data.snaps.map(snap => (
                                                    <li key={snap.id} className={snap.id < 0 ? 'optimistic': ''}>
                                                        <div className="title">
                                                            <span className="username">@{snap.user.username} </span>
                                                            {snap.text}
                                                        </div>
                                                        <div className="date">
                                                            <span>
                                                                {snap.id < 0 ? 'sending...': <TimeAgo date={snap.createdAt}/>}
                                                            </span>
                                                        </div>
                                                    </li>
                                                ))
                                            }
                                        </ul>
                                        <div className="counter">{data.snaps.length} snap(s)</div> 
                                    </div>
                                    
                                );
                            }
                        }
                    </Query>
                </div>
                
            </div>
        )
    }
}

export default Home;
