import re

def convert_to_sqlite(schema_path):
    with open(schema_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Change provider
    content = content.replace('provider = "postgresql"', 'provider = "sqlite"')
    content = content.replace('env("DATABASE_URL")', '"file:./dev.db"')

    # 2. Remove all enums
    content = re.sub(r'enum\s+\w+\s*\{[^}]*\}', '', content)

    # 3. Replace Enum types with String and fix defaults
    content = re.sub(r'role\s+Role\s+@default\(CUSTOMER\)', 'role String @default("CUSTOMER")', content)
    content = re.sub(r'status\s+OrderStatus\s+@default\(PENDING\)', 'status String @default("PENDING")', content)
    content = re.sub(r'paymentMethod\s+PaymentMethod', 'paymentMethod String @default("COD")', content)
    content = re.sub(r'paymentStatus\s+PaymentStatus\s+@default\(UNPAID\)', 'paymentStatus String @default("UNPAID")', content)

    # 4. Replace arrays
    content = re.sub(r'String\[\]', 'String', content)

    # 5. Replace Json
    content = re.sub(r'Json\?', 'String?', content)
    content = re.sub(r'Json', 'String', content)

    with open(schema_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("Schema updated successfully.")

if __name__ == "__main__":
    convert_to_sqlite("prisma/schema.prisma")
