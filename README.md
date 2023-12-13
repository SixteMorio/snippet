1.ajouter un dossier .env et ajouter ce code dedans: JWT_KEY="mon super secret"

                                                    DATABASE_URL="mysql://root:root@localhost:3306/masscode?schema=public"

                                                    SALT="123"

2. Vérifier que vous aveez le bon port.
3. Créer un database "masscode" et ajouter les models par migrations prisma.
