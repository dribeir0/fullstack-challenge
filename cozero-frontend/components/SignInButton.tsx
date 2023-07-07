import { Avatar, Text, Flex, Container, Menu, MenuButton, MenuList, MenuItemOption } from "@chakra-ui/react";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { translate } from "../utils/language.utils";

export const SignInButton = () => {
    const navigate = useNavigate()
    const { user, signOut } = useAuth()

    return (
        <Flex gap={4} >
            <Container id='signup' onClick={() => user ? signOut() : navigate('/sign-in')} cursor='pointer'>
                <Text>{translate(user ? 'SIGN_OUT' : 'SIGN_IN')}</Text>
            </Container>
            <Menu>
                <MenuButton disabled={!user} cursor={user ? 'pointer' : 'default'}>
                    <Avatar name={user?.email} size="sm" />
                </MenuButton>
                <MenuList>
                    <MenuItemOption onClick={() => navigate('/projects/deleted')}>Deleted Projects</MenuItemOption>
                </MenuList>
            </Menu>
        </Flex>
    )
}