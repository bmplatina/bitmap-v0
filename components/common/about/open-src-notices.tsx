import { Box, Button, Dialog, Flex, Link, Text } from "@radix-ui/themes";
import { ReactNode } from "react";

export default async function OpenSourceNotices({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Link href="#">
          <Text size="2" color="blue">
            {children}
          </Text>
        </Link>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="450px">
        <Dialog.Title>{children}</Dialog.Title>

        <Flex direction="column" gap="3">
          <Text size="3" mb="1" weight="bold">
            Bitmap Production™ Website
          </Text>
          <Box asChild px="4">
            <ul style={{ listStyleType: "disc" }}>
              <li>
                <Text size="2">Frontend: Next.js (React)</Text>
              </li>
              <li>
                <Text size="2">Scripting: TypeScript</Text>
              </li>
              <li>
                <Text size="2">Styling: Tailwind, PostCSS</Text>
              </li>
              <li>
                <Text size="2">Themes: Radix UI</Text>
              </li>
              <li>
                <Text size="2">Icons: Lucide</Text>
              </li>
              <li>
                <Text size="2">API Communication: Axios</Text>
              </li>
              <li>
                <Text size="2">Markdown: Monaco Editor, react-markdown</Text>
              </li>
              <li>
                <Text size="2">Animation: Framer Motion</Text>
              </li>
            </ul>
          </Box>
          <Text>
            Visit{" "}
            <Link href="https://github.com/bmplatina/bitmap-v0" target="_blank">
              <Text color="blue">GitHub</Text>
            </Link>{" "}
            to see all dependencies.
          </Text>
        </Flex>

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Close
            </Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
