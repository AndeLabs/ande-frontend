
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode, Store, Smartphone } from "lucide-react";

export default function AbobPaySection() {
  return (
    <section id="abob-pay" className="py-16 sm:py-24">
      <div className="container">
        <div className="text-center lg:w-2/3 mx-auto">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">El Futuro de los Pagos: ABOB-Pay</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            ABOB-Pay es nuestra visión para un ecosistema de pagos sin fricciones, construido sobre AndeChain. Imagina un mundo donde cada transacción es casi instantánea, con costos mínimos y sin intermediarios.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                <QrCode className="h-8 w-8 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="mb-2">Pagos con QR</CardTitle>
              <p className="text-muted-foreground">Un sistema simple y universal para que clientes y comercios envíen y reciban valor al instante.</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                <Store className="h-8 w-8 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="mb-2">Integración en Comercios</CardTitle>
              <p className="text-muted-foreground">Planeamos ofrecer APIs y SDKs para que cualquier punto de venta (POS) o e-commerce pueda aceptar ABOB fácilmente.</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                <Smartphone className="h-8 w-8 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="mb-2">App Móvil</CardTitle>
              <p className="text-muted-foreground">El objetivo final es una billetera móvil intuitiva que ponga el poder de AndeChain en el bolsillo de todos.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
