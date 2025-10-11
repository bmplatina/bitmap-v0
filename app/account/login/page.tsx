import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Button, Checkbox, Flex, Separator, Text } from "@radix-ui/themes";

export default function AccountPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Bitmap ID</h1>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Bitmap ID</CardTitle>
            <CardDescription>
              Bitmap의 모든 서비스에 접근하십시오.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Input placeholder="이메일 주소"></Input>
            <Input type="password" placeholder="비밀번호"></Input>
            <Separator />
            {/* <Text as="label" size="2">
              <Flex gap="2">
                <Checkbox defaultChecked />
                Agree to Terms and Conditions
              </Flex>
            </Text> */}
            <Flex direction="column" gap="3">
              <Text as="label" size="2">
                <Flex as="span" gap="2">
                  <Checkbox size="1" defaultChecked /> Agree to Terms and
                  Conditions
                </Flex>
              </Text>
            </Flex>
            <Button>로그인</Button>
            <Button variant="ghost">계정이 없으십니까?</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
