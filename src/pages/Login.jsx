import React, { useState } from 'react'
import { Avatar, Button, Container, IconButton, Paper, Stack, TextField, Typography } from '@mui/material'
import {CameraAlt as CameraAltIcon} from '@mui/icons-material'
import { VisuallyHiddenInput } from '../components/styles/StyledComponent';
import {useFileHandler, useInputValidation, useStrongPassword} from '6pp';
import {usernameValidator} from '../utils/validator'
import axios from 'axios';
import { server } from '../constants/config';
import { useDispatch } from 'react-redux';
import { userExists } from '../redux/reducers/auth';
import toast from 'react-hot-toast';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const toggleLogin = () => setIsLogin((prev) => !prev);
  const name = useInputValidation('');
  const bio = useInputValidation('');
  const username = useInputValidation('',usernameValidator);
  const password = useStrongPassword();
  const avatar = useFileHandler("single");
  const dispatch = useDispatch();
  const handleLogin = async(e) =>{
    e.preventDefault();
    const config = {
      withCredentials: true,
      headers:{
        "Content-Type" : 'application/json'
      }
    };
    try{
      const {data} = await axios.post(`${server}/api/v1/user/login`,{
        username : username.value,
        password : password.value
      },config)
      dispatch(userExists(data.user));
      toast.success(data.msg);
    }
    catch(err){
      toast.error(err?.response?.data?.msg  || "Something went wrong");
    }
  }
  const handleSignUp = async(e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("avatar",avatar.file);
    formData.append("name",name.value);
    formData.append("bio",bio.value);
    formData.append("username",username.value);
    formData.append("password",password.value);
    const config = {
      withCredentials: true,
      headers:{
        "Content-Type" : 'multipart/form-data'
      }
    }; 
    try{
      const {data} = await axios.post(`${server}/api/v1/user/register`,formData,config);
      dispatch(userExists(data.user));
      toast.success(data.msg);
    }
    catch(err){
      toast.error(err?.response?.data?.msg  || "Something went wrong");
    }
  }
  return (
    <div style={{
      backgroundImage : "linear-gradient(rgba(200,200,200,0.5),rgba(120,110,220,0.5))"
    }}>

    <Container 
      component={"main"} 
      maxWidth="xs" 
      sx={{
        height:"100vh",
        display : "flex",
        justifyContent : "center",
        alignItems : "center"
    }}>
      <Paper 
        elevation={3} 
        sx={{
          padding:4, 
          display:"flex", 
          flexDirection:"column", 
          alignItems:"center" }}
      >
        {isLogin ? 
          <>
            <Typography variant='h5'>Login</Typography>
            <form style={{
              width : "100%",
              marginTop : "1rem"
            }}
            onSubmit={handleLogin}
            >
              <TextField 
                required
                fullWidth 
                label="Username" 
                margin="normal" 
                variant="outlined" 
                value={username.value}
                onChange={username.changeHandler}
              />
              {
                username.error && (
                  <Typography color="error" variant='caption'>
                    {username.error}
                  </Typography>
                )
              }
              <TextField 
                required
                fullWidth 
                label="Password" 
                type = "password"
                margin="normal" 
                variant="outlined"
                value={password.value}
                onChange={password.changeHandler} 
              />  
              {
                password.error && (
                  <Typography color="error" variant='caption'>
                    {password.error}
                  </Typography>
                )
              }  
              <Button 
                sx={{marginTop: "1rem"}} 
                variant='contained' 
                color='primary' 
                type="submit"
                fullWidth 
              >
                Login
              </Button>  
              <Typography textAlign={'center'} m={"1rem"}>OR</Typography>  
              <Button 
                variant='text' 
                onClick={toggleLogin}
                fullWidth
              >
                Sign Up Instead
              </Button>  
            </form>
          </>
        : 
          <>
            <Typography variant='h5'>Sign Up</Typography>
            <form style={{
              width : "100%",
              marginTop : "1rem"
            }}
            onSubmit={handleSignUp}
            >
              <Stack position={"relative"} width={"10rem"} margin={"auto"}>
                <Avatar sx={{
                  width : "10rem",
                  height : "10rem",
                  objectFit : "contain"
                }} 
                src={avatar.preview}
                />
                <IconButton 
                  sx={{
                    position :"absolute",
                    bottom : "0",
                    right : "0",
                    color : "white",
                    bgcolor : "rgba(0,0,0,0.5)",
                    ":hover" : {
                      bgcolor : "rgba(0,0,0,0.7)",
                    }
                  }}
                  component = "label"
                >
                  <>
                    <CameraAltIcon />
                    <VisuallyHiddenInput type="file" onChange={avatar.changeHandler}></VisuallyHiddenInput>
                  </>
                </IconButton>
              </Stack>
              <TextField 
                required
                fullWidth 
                label="Name" 
                margin="normal" 
                variant="outlined" 
                value={name.value}
                onChange={name.changeHandler}
              />
              <TextField 
                required
                fullWidth 
                label="Bio" 
                margin="normal" 
                variant="outlined" 
                value={bio.value}
                onChange={bio.changeHandler}
              />
              <TextField 
                required
                fullWidth 
                label="Username" 
                margin="normal" 
                variant="outlined" 
                value={username.value}
                onChange={username.changeHandler}
              />
              {
                username.error && (
                  <Typography color="error" variant='caption'>
                    {username.error}
                  </Typography>
                )
              }
              <TextField 
                required
                fullWidth 
                label="Password" 
                type = "password"
                margin="normal" 
                variant="outlined"
                value={password.value}
                onChange={password.changeHandler} 
              />   
              {
                password.error && (
                  <Typography color="error" variant='caption'>
                    {password.error}
                  </Typography>
                )
              }  
              <Button 
                sx={{marginTop: "1rem"}} 
                variant='contained' 
                color='primary' 
                type="submit"
                fullWidth 
              >
                Sign Up
              </Button>  
              <Typography textAlign={'center'} m={"1rem"}>OR</Typography>  
              <Button 
                variant='text' 
                onClick={toggleLogin}
                fullWidth
              >
                Login Instead
              </Button>  
            </form>
          </>
        }
      </Paper>
    </Container>
  </div>

  )
}

export default Login