import React, { useContext, useState } from "react";
import { Button } from "primereact/button";
import { Ripple } from "primereact/ripple";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { AuthContext } from "../../contexts/AuthContext";

export default function LoginButton() {
  const { login, openLogin, closeLogin, loginVisible } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [working, setWorking] = useState(false);

  const handleLogin = async () => {
    setWorking(true);
    try {
      await login(email, password);
    } finally {
      setWorking(false);
    }
  };

  return (
    <>
      <Button link icon="pi pi-sign-in" label="Login" type="button" className="text-white" onClick={openLogin}>
        <Ripple />
      </Button>
      <Dialog header="Login" visible={loginVisible} onHide={closeLogin} className="w-11 md:w-6 lg:w-4">
        <div className="flex flex-column gap-3">
          <span className="p-input-icon-left">
            <i className="pi pi-envelope" />
            <InputText value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full" />
          </span>
          <Password value={password} onChange={(e) => setPassword(e.target.value)} toggleMask feedback={false} placeholder="Senha" className="w-full" />
          <Button label={working ? "Entrando..." : "Entrar"} icon="pi pi-sign-in" onClick={handleLogin} loading={working} />
        </div>
      </Dialog>
    </>
  );
}
